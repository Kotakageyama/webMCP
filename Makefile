PROJECT_ID ?= your-gcp-project
REGION ?= asia-northeast1
REPOSITORY ?= tasksurface
SERVICE_ACCOUNT ?= tasksurface-run-sa@$(PROJECT_ID).iam.gserviceaccount.com
IMAGE_TAG ?= $$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)
IMAGE := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/tasksurface:$(IMAGE_TAG)

build:
	gcloud builds submit --config cloudbuild.yaml --substitutions=_IMAGE=$(IMAGE) .

deploy:
	gcloud run deploy tasksurface --image $(IMAGE) --project $(PROJECT_ID) --region $(REGION) --platform managed --allow-unauthenticated --port 8080 --service-account $(SERVICE_ACCOUNT) --set-secrets DATABASE_URL=tasksurface-database-url:latest

release: build deploy
