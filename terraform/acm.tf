resource "aws_acm_certificate" "wildcard_certificate" {
  domain_name       = "*.crassus.app.br"
  validation_method = "DNS"
}

