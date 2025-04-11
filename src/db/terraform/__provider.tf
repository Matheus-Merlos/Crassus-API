terraform {
  required_version = "~> 1.11.3"
  required_providers {
    postgresql = {
      source  = "cyrilgdn/postgresql"
      version = "~> 1.25.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.7.2"
    }
  }
}

provider "postgresql" {
  host            = var.db_host
  port            = var.db_port
  database        = "postgres"
  username        = var.db_user
  password        = var.db_password
  sslmode         = "disable"
  connect_timeout = 15
}