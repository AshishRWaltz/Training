import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  //add user
  'required': 'The {{ field }} field is required',
  'first_name.regex': 'First name can only contain letters and spaces.',
  'first_name.minLength': 'First name should contain at least 2 characters.',
  'first_name.maxLength': 'First name should not contain more than 50 characters.',
  'last_name.regex': 'Last name can only contain letters and spaces.',
  'last_name.minLength': 'Last name should contain at least 2 characters.',
  'last_name.maxLength': 'Last name should not contain more than 50 characters.',
  'institution_name.regex': 'Institution name can only contain letters and spaces.',
  'institution_name.minLength': 'Institution name should contain at least 2 characters.',
  'institution_name.maxLength': 'Institution name should not contain more than 100 characters.',
  'mobile.regex': 'Mobile number must be exactly 10 digits and contain only numbers.',
  'email.email': 'Please enter a valid email',
  'password.minLength': 'Password should contain at least 6 characters',
  'password.maxLength': 'Password should not contain more than 15 characters',
  'password.regex':
    'Password must contain atleast 1 uppercase, 1 lower case, 1 number & 1 special character',
  'password.confirmed': 'Password and confirm password should be match',

  //Api Key
  'name.minLength': '{{ field }}  must be at least {{ min}} characters long.',
  'name.maxLength': '{{ field }} cannot exceed {{ max }} characters.',
  'name.regex': 'API key name can only contain letters and spaces.',

  //Subscription
  'user_id.number': 'User ID must be a number.',
  'user_id.min': 'User ID must be a positive number greater than or equal to 1.',
  'subscription_id.number': 'Subscription ID must be a number.',
  'subscription_id.min': 'Subscription ID must be a positive number greater than or equal to 1.',

  //Payment
  'razorpay_payment_id.string': 'razorpay Payment Id must be a string', // Razorpay payment ID
  'razorpay_order_id.string': 'Razorpay Order Id must be a string',
  'razorpay_signature.string': 'Razorpay Signature must be a string',
  // 'amount.number': 'Amount must be a numebr.',
  // 'currency.string': 'Currency must be a string.',
  // 'receipt': 'Receipt must be a string',
  // Subscription Plan
  'name.string': 'Subscription plan name must be a string.',
  'type.string': 'Subscription plan type must be a string.',
  'type.enum': 'The type must be one of the following: monthly, quarterly, or yearly.',
  'styleType.enum':
    'The styleType must be one of the following: basic, silver, platinum, gold, or diamond.',
  'type.maxLength': 'Subscription plan type must not exceed 100 characters.',
  'price.number': 'Price must be a number.',
  'price.min': 'Price must be a non-negative number.',
  'description.string': 'Description must be a string.',
  'description.maxLength': 'Description must not exceed 1000 characters.',
  'duration.number': 'Duration must be a number.',
  'duration.min': 'Duration must be a non-negative number.',
  'quota.number': 'Quota must be a number.',
  'quota.min': 'Quota must be a non-negative number.',

  //Change Password

  'old_password.minLength': 'Old password must be at least 6 characters long.',
  'old_password.maxLength': 'Old password must not exceed 15 characters.',
  'old_password.regex':
    'Old password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',

  'new_password.minLength': 'New password must be at least 6 characters long.',
  'new_password.maxLength': 'New password must not exceed 15 characters.',
  'new_password.regex':
    'New password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
  'new_password.confirmed': 'Password and confirm password should match.',
  'token.required': 'Reset password token is required.',

  ///change template

  'status.enum': 'Status must be either draft, archive, or published.',
})
