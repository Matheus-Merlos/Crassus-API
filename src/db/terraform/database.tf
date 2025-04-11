resource "postgresql_database" "crassus_db" {
  name             = "crassus"
  connection_limit = 3
}