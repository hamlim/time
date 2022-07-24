export type Result =
  | {
      data: {
        dates: Array<{
          name: string
          date: string
        }>
        passkey: string
      }
      success: true
    }
  | {
      message: string
      success: false
    }
