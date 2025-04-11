output "crassus_user_password" {
  value     = random_string.crassus_user_password.result
  sensitive = true
}