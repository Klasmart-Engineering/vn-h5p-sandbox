# vn-h5p-sandbox
H5P libraries testing

### __How to install, update & test.__

1. Setup localhost
- Setup hosts & mysql local
- Duplicate `wp-config-sample.php` to `wp-config.php` and update your localhost information.
- Add .htaccess to root folder (Download here -> https://drive.google.com/drive/folders/1mIhad4trgbscNSP1wX5ARnjo4WzJXKub?usp=sharing)
2. Update h5p libraries
- Get the latest version here -> https://github.com/KL-Engineering/kidsloop-h5p-library (`h5p/libraries`)
- Copy all libraries from this folder (`kidsloop-h5p-library/h5p/libraries`)
- Paste to the upload folder (`vn-h5p-sandbox/src/wp-content/uploads/h5p/libraries`)
3. Upload the h5p content that you need to check to find out the missing libraries
- Access to the `wp-admin` -> `plugins`
- Find, add H5P & active plugin -> `Interactive Content – H5P`
- Access `H5P Content` plugin -> Add new content (upload your content file)
- Get the error if the libraries are missing
- Add the missing library to database
4. Testing