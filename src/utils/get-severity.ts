export const getSeverity = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'INACTIVE':
      return 'warning'
    case 'EXPENSE':
      return 'danger'
    case 'INCOME':
      return undefined
    default:
      return 'info'
  }
}
