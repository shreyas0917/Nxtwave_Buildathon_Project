# Contributing to Nationwide Livestock AI Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize user privacy and ethical AI practices
- Follow the project's coding standards

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/livestock-ai-platform.git`
3. Create a virtual environment: `python -m venv venv`
4. Install dependencies: `pip install -r backend/requirements.txt`
5. Install frontend dependencies: `cd frontend && npm install`
6. Copy `.env.example` to `.env` and configure
7. Run `python backend/init_models.py` to initialize models

## Coding Standards

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for all functions and classes
- Maximum line length: 100 characters
- Use `black` for code formatting (if configured)

### JavaScript/React (Frontend)
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add breed identification feature`
- `fix: Resolve memory leak in model loading`
- `docs: Update API documentation`
- `refactor: Reorganize service layer`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request with a clear description

## Testing

- Write unit tests for new features
- Ensure existing tests pass
- Test on multiple browsers/devices for frontend changes

## Documentation

- Update README.md for significant changes
- Add/update API documentation in `docs/API.md`
- Include code comments for complex logic

## Questions?

Open an issue for questions or discussions about contributions.
