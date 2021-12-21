export interface MediaImage {
    data: {
      attributes: {
        alternativeText: string
        url: string
      }
    }
}
  
export interface Article {
    attributes: {
      description: string
      title: string
      image?: MediaImage
    }
    id: number
}