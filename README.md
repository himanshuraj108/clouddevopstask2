# 🚀 MERN Stack App — AWS Cloud Deployment

A production-ready **MERN** (MongoDB, Express.js, React + Vite, Node.js) full-stack application with complete **AWS cloud infrastructure** (S3, CloudFront, Route 53, API Gateway, ECS Fargate, RDS) and **Docker** / **Kubernetes** support.

---

## 👥 Team

| Member | Role | GitHub |
|--------|------|--------|
| Member 1 | Team Lead / Backend | @member1 |
| Member 2 | Frontend Architect | @member2 |
| Member 3 | DevOps / Docker / K8s | @member3 |
| Member 4 | AWS Infrastructure | @member4 |
| Member 5 | Testing / CI/CD | @member5 |

---

## 🏗️ Architecture

```
Internet
    │
    ├── CloudFront CDN (cache + HTTPS)
    │       │
    │       └── S3 Static Hosting (React SPA)
    │
    └── Route 53 DNS
            │
            └── API Gateway (HTTP API)
                    │
                    └── ALB → ECS Fargate (Node.js/Express API)
                                    │
                                    └── RDS PostgreSQL (Database)
```

---

## 📁 Project Structure

```
clouddevepostask2/
├── backend/                   # Express + Node.js API
│   ├── models/                #   Mongoose models (User, Item)
│   ├── routes/                #   API routes (auth, users, items)
│   ├── middleware/            #   Auth, authorize, error handler
│   ├── server.js              #   Entry point
│   ├── Dockerfile             #   Multi-stage Docker build
│   └── .env.example           #   Environment variables template
│
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── pages/             #   Home, Login, Register, Dashboard, Items, Profile
│   │   ├── components/        #   Navbar, Footer
│   │   ├── store/             #   Zustand auth store
│   │   ├── utils/             #   Axios API client
│   │   ├── App.jsx            #   Root component + routing
│   │   └── index.css          #   Global dark glassmorphism design system
│   ├── Dockerfile             #   Multi-stage: Node build → Nginx serve
│   └── nginx.conf             #   SPA routing + gzip + proxy
│
├── aws/                       # AWS CloudFormation YAML templates
│   ├── vpc.yaml               #   VPC, subnets, NAT, security groups
│   ├── s3-cloudfront-route53.yaml  # Frontend CDN + DNS
│   ├── ecs.yaml               #   ECS Fargate cluster + ALB + autoscaling
│   ├── rds.yaml               #   RDS PostgreSQL Multi-AZ
│   └── api-gateway.yaml       #   HTTP API Gateway with custom domain
│
├── k8s/                       # Kubernetes manifests (EKS)
│   └── backend.yaml           #   Deployment, Service, HPA, Ingress
│
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions CI/CD pipeline
│
├── docker-compose.yml         # Local development (all services)
└── README.md
```

---

## ⚡ Quick Start — Local Development

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- Docker Desktop
- MongoDB (or use Docker Compose)

### Option A: Docker Compose (recommended)
```bash
# Clone & start all services
git clone https://github.com/YOUR-TEAM/clouddevepostask2.git
cd clouddevepostask2
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/health |
| Mongo Express | http://localhost:8081 |

### Option B: Manual
```bash
# Backend
cd backend
cp .env.example .env   # Fill in your values
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## ☁️ AWS Deployment Guide

### Required AWS Services
- IAM user with appropriate permissions
- ACM certificate (in `us-east-1` for CloudFront)
- Route 53 Hosted Zone

### Step 1 — Deploy VPC
```bash
aws cloudformation deploy \
  --template-file aws/vpc.yaml \
  --stack-name mern-vpc-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Environment=production
```

### Step 2 — Deploy RDS
```bash
aws cloudformation deploy \
  --template-file aws/rds.yaml \
  --stack-name mern-rds-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    Environment=production \
    VpcStackName=mern-vpc-stack \
    DBPassword=YourSecurePassword123!
```

### Step 3 — Deploy ECS Backend
```bash
aws cloudformation deploy \
  --template-file aws/ecs.yaml \
  --stack-name mern-ecs-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    Environment=production \
    VpcStackName=mern-vpc-stack \
    DockerImage=YOUR_ECR_IMAGE_URI \
    JwtSecret=YourJwtSecret
```

### Step 4 — Deploy Frontend (S3 + CloudFront + Route53)
```bash
aws cloudformation deploy \
  --template-file aws/s3-cloudfront-route53.yaml \
  --stack-name mern-frontend-stack \
  --parameter-overrides \
    DomainName=example.com \
    SubDomain=www \
    AcmCertificateArn=arn:aws:acm:... \
    HostedZoneId=Z1234567890
```

### Step 5 — Deploy API Gateway
```bash
aws cloudformation deploy \
  --template-file aws/api-gateway.yaml \
  --stack-name mern-api-stack \
  --parameter-overrides \
    BackendALBDnsName=YOUR_ALB_DNS \
    DomainName=api.example.com \
    AcmCertificateArn=arn:aws:acm:...
```

### Step 6 — Upload Frontend to S3
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_CF_ID --paths "/*"
```

---

## 🐳 Docker Commands

```bash
# Build images manually
docker build -t mern-backend ./backend
docker build -t mern-frontend ./frontend

# Run with Docker Compose
docker-compose up -d          # Start all
docker-compose down           # Stop all
docker-compose logs -f        # Stream logs
docker-compose ps             # Check status
```

---

## ☸️ Kubernetes (EKS) Deployment

```bash
# Update kubeconfig for EKS
aws eks update-kubeconfig --region us-east-1 --name YOUR_EKS_CLUSTER

# Edit secrets in k8s/backend.yaml before applying!
kubectl apply -f k8s/backend.yaml

# Check deployment
kubectl get pods -n mern-app
kubectl get svc -n mern-app
kubectl get ingress -n mern-app
```

---

## 🔐 GitHub Secrets Required

Add these to your GitHub repository secrets:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `S3_BUCKET_NAME` | S3 bucket for frontend |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront dist ID |
| `VITE_API_URL` | Backend API URL for frontend build |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Zustand, React Router v6, Axios |
| Backend | Node.js, Express.js, JWT, bcryptjs, Mongoose |
| Database | MongoDB / PostgreSQL (RDS) |
| Container | Docker, Docker Compose, Nginx |
| Orchestration | AWS ECS Fargate / Kubernetes (EKS) |
| CDN/DNS | AWS CloudFront, Route 53 |
| Storage | AWS S3 |
| API | AWS API Gateway (HTTP API) |
| CI/CD | GitHub Actions |
| Security | Helmet, CORS, Rate Limiting, Non-root containers |

---

## 📚 API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login and get JWT |
| `/api/auth/me` | GET | ✅ | Get current user |
| `/api/users` | GET | 👑 Admin | List all users |
| `/api/users/:id` | PUT | ✅ | Update user |
| `/api/items` | GET | ❌ | List items (paginated) |
| `/api/items/:id` | GET | ❌ | Get item by ID |
| `/api/items` | POST | ✅ | Create item |
| `/api/items/:id` | PUT | ✅ | Update item |
| `/api/items/:id` | DELETE | ✅ | Delete item |
| `/health` | GET | ❌ | Health check |

---

## 🤝 Contributing (Team Workflow)

1. **Fork or clone** the repo
2. Create a feature branch: `git checkout -b feature/your-name/feature-name`
3. Make your changes with meaningful commits
4. Push: `git push origin feature/your-name/feature-name`
5. Open a Pull Request to `main`

Each team member should work on a separate branch so commits are visible per person.

---

## 📄 License

MIT License — Free to use for academic and commercial purposes.
