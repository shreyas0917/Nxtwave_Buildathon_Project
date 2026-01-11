"""
Tests for trust score calculation
"""

import pytest
from app.services.trust_service import TrustService


@pytest.fixture
def trust_service():
    """Create trust service instance"""
    return TrustService()


def test_trust_score_calculation(trust_service):
    """Test basic trust score calculation"""
    score = trust_service.calculate_trust_score(
        model_confidence=0.9,
        regional_validity=0.8,
        community_feedback=0.7
    )
    
    assert isinstance(score, float)
    assert 0 <= score <= 1
    
    # Manual calculation: 0.9*0.3 + 0.8*0.4 + 0.7*0.3 = 0.8
    expected = 0.9 * 0.3 + 0.8 * 0.4 + 0.7 * 0.3
    assert abs(score - expected) < 0.001


def test_trust_score_with_zero_values(trust_service):
    """Test trust score with zero values"""
    score = trust_service.calculate_trust_score(
        model_confidence=0.0,
        regional_validity=0.0,
        community_feedback=0.0
    )
    
    assert score == 0.0


def test_trust_score_with_max_values(trust_service):
    """Test trust score with maximum values"""
    score = trust_service.calculate_trust_score(
        model_confidence=1.0,
        regional_validity=1.0,
        community_feedback=1.0
    )
    
    assert score == 1.0


def test_trust_score_weights_sum_to_one(trust_service):
    """Test that trust score weights sum to 1.0"""
    from app.core.config import settings
    
    total = (
        settings.TRUST_WEIGHT_CONFIDENCE +
        settings.TRUST_WEIGHT_REGIONAL +
        settings.TRUST_WEIGHT_FEEDBACK
    )
    
    assert abs(total - 1.0) < 0.001


@pytest.mark.asyncio
async def test_regional_validity_calculation(trust_service):
    """Test regional validity calculation"""
    validity = await trust_service.calculate_regional_validity(
        breed="Gir",
        region="Gujarat"
    )
    
    assert isinstance(validity, float)
    assert 0 <= validity <= 1


@pytest.mark.asyncio
async def test_regional_validity_unknown_breed(trust_service):
    """Test regional validity with unknown breed"""
    validity = await trust_service.calculate_regional_validity(
        breed="Unknown",
        region="Gujarat"
    )
    
    assert isinstance(validity, float)
    assert 0 <= validity <= 1


@pytest.mark.asyncio
async def test_community_feedback(trust_service):
    """Test community feedback retrieval"""
    feedback = await trust_service.get_community_feedback(
        breed="Gir",
        region="Gujarat"
    )
    
    assert isinstance(feedback, float)
    assert 0 <= feedback <= 1
