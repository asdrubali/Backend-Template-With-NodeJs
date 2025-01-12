const USER_BLOCK_POLICY = Object.freeze({

  /**
   * Minimum number of minutes a user can be blocked.
   */
  MIN_BLOCKED_MINUTES: 10,

  /**
   * Maximum number of attempts before blocking the user.
   */
  MAX_ATTEMPTS: 3,               
  
} as const);

export {
  USER_BLOCK_POLICY
}
