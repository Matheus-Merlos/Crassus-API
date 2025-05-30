resource "aws_acm_certificate" "wildcard_certificate" {
  domain_name       = "*.crassus.app.br"
  validation_method = "DNS"
}

resource "aws_acm_certificate" "wildcard_test_certificate" {
  domain_name       = "*.test.crassus.app.br"
  validation_method = "DNS"
}
