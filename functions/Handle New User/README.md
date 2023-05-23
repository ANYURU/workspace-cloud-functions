# Handle New User
<!-- 
Welcome to the documentation of this function 👋 We strongly recommend keeping this file in sync with your function's logic to make sure anyone can easily understand your function in the future. If you don't need documentation, you can remove this file. -->
A cloud function to handle user at creation.

## 🤖 Documentation

The cloud function is designed to perform specific tasks upon the creation of a new user in the system. It carries out the following actions:

1. Creation of a New Document: It creates a new document within the users collection, representing the newly registered user. This document will contain the relevant user information such as name, email, and other necessary details.

2. Assignment of Free Package: Upon creating the user document, the function automatically assigns a free package to the newly registered user. The details of the free package, such as its features and limitations, will be included in the user document.

3. Addition of the user to the system team: It adds the user to the system team. If the user is the first to be added as a member or an administrator.

By executing these tasks, the cloud function seamlessly handles the registration process for new users, creating user documents, assigning the appropriate package as well as the right roles both at system team level and document level in the users collection system.


<!-- Update with your description, for example 'Create Stripe payment and return payment URL' -->

_Example input:_

This function expects no input

<!-- If input is expected, add example -->

_Example output:_

<!-- Update with your expected output -->
This function has no output
<!-- 
```json
{
 "areDevelopersAwesome": true
}
``` -->

## 📝 Environment Variables

List of environment variables used by this cloud function:

- **APPWRITE_FUNCTION_ENDPOINT** - Endpoint of Appwrite project
- **APPWRITE_FUNCTION_API_KEY** - Appwrite API Key
- **SECRET_KEY** - Appwrite API key
- **APPWRITE_FUNCTION_EVENT_DATA** - The object of the new user returned after creation o f the user
- **APPWRITE_DATABASE_ID** - Appwrite Database ID
- **USER_COLLECTION_ID** - Appwrite Users Collection ID
- **SYSTEM_TEAMS_ID** - Appwrite System Team ID
<!-- Add your custom environment variables -->

## 🎯 Trigger
Head over to your function in the Appwrite console and under the Settings Tab, enable the create.*.create event.


