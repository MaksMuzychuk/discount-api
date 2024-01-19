variable "region" {
    default = "us-east-1"
}

variable infra_env {
    type = map(string)
    default =  {
        staging = "infra-staging"
        production   = "infra-production"
    }
}

variable "public_key" {
  
}
variable "private_key" {
  
}
variable "key_name" {
  
}