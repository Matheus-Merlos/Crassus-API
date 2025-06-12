output "cloudfront_endpoint" {
  value = aws_cloudfront_distribution.cdn.domain_name
}