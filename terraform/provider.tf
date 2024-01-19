terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>4.0"
    }
  }
  backend "s3" {
    key                  = "terraform.tfstate"
    workspace_key_prefix = "workspaces"
  }
}

provider "aws" {
  region = var.region
}