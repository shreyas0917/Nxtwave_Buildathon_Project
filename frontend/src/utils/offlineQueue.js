/**
 * Offline Queue Manager
 * Handles queuing and processing of API requests when offline
 */

import { openDB } from 'idb'

const DB_NAME = 'livestock-ai-queue'
const STORE_NAME = 'requests'

let dbInstance = null

/**
 * Initialize IndexedDB
 */
export async function initQueue() {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('type', 'type')
        }
      }
    })
  }
  return dbInstance
}

/**
 * Add request to offline queue
 */
export async function queueRequest(request) {
  const db = await initQueue()
  const requestData = {
    ...request,
    timestamp: Date.now(),
    retries: 0,
    status: 'queued'
  }
  const id = await db.add(STORE_NAME, requestData)
  console.log('Request queued:', id, requestData)
  return id
}

/**
 * Get all queued requests
 */
export async function getQueuedRequests() {
  const db = await initQueue()
  return await db.getAll(STORE_NAME)
}

/**
 * Remove request from queue
 */
export async function removeQueuedRequest(id) {
  const db = await initQueue()
  await db.delete(STORE_NAME, id)
}

/**
 * Update request retry count
 */
export async function updateRequestRetry(id, retries) {
  const db = await initQueue()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const request = await store.get(id)
  
  if (request) {
    request.retries = retries
    request.status = retries > 3 ? 'failed' : 'queued'
    await store.put(request)
  }
  
  await tx.done
}

/**
 * Process queued requests when online
 */
export async function processQueue(apiClient) {
  if (!navigator.onLine) {
    console.log('Still offline, skipping queue processing')
    return
  }

  const db = await initQueue()
  const requests = await db.getAll(STORE_NAME)
  
  console.log(`Processing ${requests.length} queued requests...`)

  for (const request of requests) {
    // Skip failed requests
    if (request.status === 'failed') {
      continue
    }

    try {
      // Make the API call
      await apiClient.request({
        method: request.method,
        url: request.url,
        data: request.data,
        headers: request.headers || {}
      })

      // Success - remove from queue
      await removeQueuedRequest(request.id)
      console.log(`Successfully processed queued request: ${request.id}`)
    } catch (error) {
      // Increment retry count
      const newRetries = (request.retries || 0) + 1
      await updateRequestRetry(request.id, newRetries)

      if (newRetries > 3) {
        console.error(`Request ${request.id} failed after ${newRetries} retries:`, error)
      } else {
        console.warn(`Request ${request.id} failed, will retry (${newRetries}/3):`, error)
      }
    }
  }
}

/**
 * Clear all queued requests
 */
export async function clearQueue() {
  const db = await initQueue()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.objectStore(STORE_NAME).clear()
  await tx.done
}

/**
 * Get queue status
 */
export async function getQueueStatus() {
  const db = await initQueue()
  const requests = await db.getAll(STORE_NAME)
  
  return {
    total: requests.length,
    queued: requests.filter(r => r.status === 'queued').length,
    failed: requests.filter(r => r.status === 'failed').length
  }
}

