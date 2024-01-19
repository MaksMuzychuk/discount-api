resource "aws_dynamodb_table" "table-discounts" {
  name           = "Discounts"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Country"

  attribute {
    name = "Country"
    type = "S"
  }

  attribute {
    name = "Website"
    type = "S"
  }

  global_secondary_index {
    name               = "WebsiteIndex"
    hash_key           = "Website"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["Country", "Code", "Message"]
  }
}

resource "aws_dynamodb_table" "table-users" {
  name           = "Users"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "Username"

  attribute {
    name = "Username"
    type = "S"
  }

  attribute {
    name = "Website"
    type = "S"
  }

  global_secondary_index {
    name               = "WebsiteIndex"
    hash_key           = "Website"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "INCLUDE"
    non_key_attributes = ["Username", "Company"]
  }
}