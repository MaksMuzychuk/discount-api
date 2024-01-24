resource "aws_dynamodb_table" "table-users" {
  name           = "Users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "Email"
    type = "S"
  }

  global_secondary_index {
    name               = "Email-Index"
    hash_key           = "Email"
    projection_type    = "INCLUDE"
    non_key_attributes = ["UserId", "Company", "Password"]
  }
}

resource "aws_dynamodb_table" "table-websites" {
  name           = "Websites"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "WebsiteId"

  attribute {
    name = "WebsiteId"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  global_secondary_index {
    name               = "UserId-Index"
    hash_key           = "UserId"
    projection_type    = "INCLUDE"
    non_key_attributes = ["WebsiteId", "Website"]
  }
}

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

