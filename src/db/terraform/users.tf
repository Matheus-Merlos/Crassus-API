resource "random_string" "crassus_user_password" {
  length  = 32
  special = false
  lower   = true
}

resource "postgresql_role" "crassus_user" {
  name     = "crassus_user"
  login    = true
  password = random_string.crassus_user_password.result
}

resource "postgresql_grant" "crassus_user_grant" {
  role = postgresql_role.crassus_user.name

  database    = postgresql_database.crassus_db.name
  schema      = "public"
  object_type = "table"
  privileges  = ["ALL"]
}