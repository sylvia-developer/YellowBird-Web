async function handleSignIn() {
  error.value = ''

  // Check Firebase configuration
  if (!auth) {
    error.value =
      firebaseConfigError || 'Firebase is not configured.'
    return
  }

  loading.value = true

  try {
    // STEP 1: Authenticate user with Firebase
    const credential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )

    // STEP 2: Retrieve the latest Firebase custom claims
    const tokenResult =
      await credential.user.getIdTokenResult(true)

    const claims = tokenResult.claims

    // STEP 3: Check administrator privileges
    const isAdmin =
      claims.admin === true ||
      claims.role === 'admin'

    // STEP 4: Determine the default destination
    const defaultDestination = isAdmin
      ? '/admin/dashboard'
      : '/'

    // STEP 5: Read any requested redirect
    const requestedRedirect = route.query.redirect

    // Allow only safe internal paths
    const isValidRedirect =
      typeof requestedRedirect === 'string' &&
      requestedRedirect.startsWith('/') &&
      !requestedRedirect.startsWith('//') &&
      !requestedRedirect.startsWith('/\\') &&
      !requestedRedirect.includes('\\') &&
      !/[\u0000-\u001F\u007F]/.test(requestedRedirect)

    // Check whether the requested page is an admin page
    const isAdminPath =
      isValidRedirect &&
      (
        requestedRedirect === '/admin' ||
        requestedRedirect.startsWith('/admin/') ||
        requestedRedirect.startsWith('/admin?') ||
        requestedRedirect.startsWith('/admin#')
      )

    // STEP 6: Choose the correct destination
    let destination = defaultDestination

    if (isValidRedirect) {
      if (isAdmin && isAdminPath) {
        destination = requestedRedirect
      } else if (!isAdmin && !isAdminPath) {
        destination = requestedRedirect
      }
    }

    // STEP 7: Redirect to the appropriate page
    await router.replace(destination)

  } catch (err) {
    console.error('YellowBird login error:', err)

    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/wrong-password'
    ) {
      error.value =
        'Incorrect email or password. Please try again.'

    } else if (err.code === 'auth/user-not-found') {
      error.value =
        'No account found with this email.'

    } else if (err.code === 'auth/too-many-requests') {
      error.value =
        'Too many failed attempts. Please try again later.'

    } else if (err.code === 'auth/user-disabled') {
      error.value =
        'This account has been disabled. Contact support.'

    } else if (err.code === 'auth/network-request-failed') {
      error.value =
        'Network error. Please check your internet connection.'

    } else {
      error.value =
        'Could not complete sign in. Please try again.'
    }

  } finally {
    loading.value = false
  }
}