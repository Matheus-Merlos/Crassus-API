resource "postgresql_extension" "postgis_extension" {
  name           = "postgis"
  database       = postgresql_database.crassus_db.name
  create_cascade = true
}