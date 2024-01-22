resource "aws_dynamodb_table" "table-discounts" {
  name           = "Discounts"
  billing_mode   = "PAY_PER_REQUEST"
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
    projection_type    = "INCLUDE"
    non_key_attributes = ["Country", "Code", "Message"]
  }
}

resource "aws_dynamodb_table" "table-users" {
  name           = "Users"
  billing_mode   = "PAY_PER_REQUEST"
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
    projection_type    = "INCLUDE"
    non_key_attributes = ["Username", "Company"]
  }
}