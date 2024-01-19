resource "aws_security_group" "maingroup" {
  egress = [
    {
      cidr_blocks      = ["0.0.0.0/0"]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]
  ingress = [
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = ""
      from_port        = 22
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 22
    },
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = ""
      from_port        = 80
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 5000
    }
  ]
}

module "ec2" {
  source = "./modules/ec2"

  infra_env = var.infra_env[terraform.workspace]
  infra_role = "app"

  iam_instance_profile = module.iam.ec2_profile_name
  vpc_security_group_ids = [aws_security_group.maingroup.id]

  public_key = var.public_key
  private_key = var.private_key
  key_name = var.key_name

}

module "iam" {
  source = "./modules/iam"
}

module "dynamodb" {
  source = "./modules/dynamodb"
}