import Papa from 'papaparse'

export class CsvUtils {
  public static csvToJson = async () => {
    const file = await this.selectFile('text/csv')
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        console.log(result.data)
      }
    })
  }

  public static jsonToCsv = async (data: any[], filename: string) => {
    const buffer = Papa.unparse(data, {
      delimiter: ',',
      header: true
    })
    const blob = new Blob([`\ufeff${buffer}`], { type: 'text/csv;charset=utf-8;' })
    this.createDownloadLink(blob, `${filename}.csv`)
  }

  private static createDownloadLink = (blob: Blob, filename: string) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    link.click()
  }

  private static selectFile = (contentType: string): Promise<File> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.style.opacity = '0'
      input.setAttribute('accept', contentType)

      input.addEventListener('change', () => {
        const file = input.files?.[0]
        resolve(file!)
      })

      input.click()
    })
  }
}
