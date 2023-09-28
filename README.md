# Test self signed certificate from system certificate store

## Using path to cert
1. Find the certificate from https://self-signed.badssl.com/.
2. Convert to .pem: openssl x509 -in <path/to/self_signed_bad_ssl.crt -out cert.pem
3. Add environment variable SSL_CERT_FILE=path/to/cert.pem
4. run: yarn pass

## TODO:
* How to use OpenSSL object inside node code?
* Is it possible to enable the OpenSSL object to use system certificate store?
* Can we export the system certs from OpenSSL if they are in use?
* We can then inject them to the https.agent

## What OpenSSL version there is in Nodejs
Nodejs18 uses OpenSSL version: openssl-3.0.2+quic (protocol made by google: Quick UDP Internet Connections).

Default minimum TLS version is TLSv1.2, default maximum is TLSv1.3. TLSv1 and TLSv1.1 are not supported by default, only by explicit run-time configuration (UnsafeLegacyRenegotiation).

## Options

### Node OpenSSL variables
Node has an option to use OpenSSL CA: --use-openssl-ca, but OpenSSL by default doesn't use system cert store. There will be a support for it in OpenSSL 3.2, but the feature will be behind an environment flag.

Node has also an option: https://nodejs.org/docs/latest-v18.x/api/cli.html#--openssl-configfile, where the OpenSSL configuration can be provided: https://www.openssl.org/docs/man3.0/man5/config.html

The --openssl-config runtime flag or environment variable OPENSSL_CONF, doesn't seem to take the config into use. There is an added OpenSSL config in the repo, openssl-unsafe.config, that sets max tls version to 1.1, which should be rejected. But connections are still working. Run: `yarn unsafe` to test. So far haven't found a way to get node18 to use this config and the documentation doesn't state that anything else is required.

#### Example OpenSSL configuration (made by openAI)
```
[openssl_section]: This section contains global OpenSSL settings.

oid_file: Specifies the path to the OID file.
oid_section: Specifies the section in the OID file to use.
openssl_conf: Specifies the location of the main OpenSSL configuration file.
[ca]: This section is used for Certificate Authority (CA) settings.

default_ca: Specifies the default CA section to use.
dir: Specifies the directory where CA files are stored.
certs: Specifies the directory for CA certificates.
crl_dir: Specifies the directory for Certificate Revocation Lists (CRLs).
[req]: This section is used for certificate request settings.

default_bits: The default number of bits for generating RSA private keys.
distinguished_name: Specifies the DN section to use for certificate requests.
req_extensions: Specifies the extensions section to use for certificate requests.
[x509_extensions]: This section is used for certificate extensions.

You can define custom extensions and their settings here.
[policy_match]: This section is used for certificate policy matching settings.

countryName: Specifies the country name policy.
stateOrProvinceName: Specifies the state or province name policy.
organizationName: Specifies the organization name policy.
organizationalUnitName: Specifies the organizational unit name policy.
commonName: Specifies the common name policy.
emailAddress: Specifies the email address policy.
[v3_ca]: This section is used for CA-specific settings for v3 certificates.

subjectKeyIdentifier: Specifies how to compute the Subject Key Identifier.
authorityKeyIdentifier: Specifies how to compute the Authority Key Identifier.
[v3_req]: This section is used for v3 certificate request settings.

basicConstraints: Specifies basic constraints for certificate requests.
keyUsage: Specifies key usage settings for certificate requests.
subjectAltName: Specifies subject alternative names for certificate requests.
[usr_cert]: This section is used for user certificate settings.

basicConstraints: Specifies basic constraints for user certificates.
keyUsage: Specifies key usage settings for user certificates.
subjectAltName: Specifies subject alternative names for user certificates.
[crl_ext]: This section is used for CRL extension settings.

authorityKeyIdentifier: Specifies how to compute the Authority Key Identifier for CRLs.
[tsa]: This section is used for Time Stamping Authority (TSA) settings.

tsa_name: Specifies the TSA's name.
default_policy: Specifies the default TSA policy.
```

### OpenSSL direct support for Windows system CA certificate store
Not yet supported in any Node version!

The support for OpenSSL to use Windows system certificate store is coming in OpenSSL version 3.2. Currently only a alpha version is released: https://www.openssl.org/blog/blog/2023/09/07/ossl32a1/. There is an environment variable related to this feature to enable the use of system store, it is not enabled by default.

Commit related to Windows CA certificate store in OpenSSL repo:
* Add support for Windows CA certificate store
  * https://github.com/openssl/openssl/issues/18020
  * https://github.com/openssl/openssl/pull/18070
    * Commit: dfdbc113eefb80712fefc3187367fe6050610da5p
  * https://github.com/openssl/openssl/issues/18068
    * Commit: 021859bf810a3614758c2f4871b9cd7202fac9b2

### Direct support for node
There is an open pull request to get this feature to node, at least in Windows, in: https://github.com/nodejs/node/pull/44532

So far it hasn't been merged. The code can be used as an example to read the system certificates.

### 3rd party options
There is a 3rd party implementation to use the system cert store: https://github.com/bnoordhuis/node-native-certs

It's written in rust and is very light.
