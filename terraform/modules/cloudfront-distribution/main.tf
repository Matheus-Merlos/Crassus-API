resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = ""

  aliases = [var.domain]

  origin {
    domain_name = var.public_dns
    origin_id   = "origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  price_class = "PriceClass_All"

  default_cache_behavior {
    allowed_methods  = var.allowed_methods
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "origin"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      headers = [ "authorization" ]

      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}