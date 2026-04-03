.PHONY: dev down build test test-back test-front lint migrate logs clean

# ============================
# Desarrollo
# ============================

dev:
	docker compose -f infra/docker/docker-compose.yml -f infra/docker/docker-compose.dev.yml up --build

down:
	docker compose -f infra/docker/docker-compose.yml -f infra/docker/docker-compose.dev.yml down

build:
	docker compose -f infra/docker/docker-compose.yml build

logs:
	docker compose -f infra/docker/docker-compose.yml logs -f

# ============================
# Testing
# ============================

test: test-back test-front

test-back:
	cd backend && python -m pytest tests/ -v

test-front:
	cd frontend && npm test

# ============================
# Linting
# ============================

lint: lint-back lint-front

lint-back:
	cd backend && python -m ruff check .

lint-front:
	cd frontend && npm run lint

# ============================
# Base de datos
# ============================

migrate:
	cd backend && python -m alembic -c app/db/migrations/alembic.ini upgrade head

migration:
	@read -p "Nombre de la migración: " name; \
	cd backend && python -m alembic -c app/db/migrations/alembic.ini revision --autogenerate -m "$$name"

# ============================
# Limpieza
# ============================

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true
