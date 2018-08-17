export const flatternCities = (data = []) => {
  const directControlCities = ['北京', '天津', '上海', '重庆']
  return data.reduce((prev, curr) => {
    const {province, cities} = curr
    const formatCities = directControlCities.includes(province)
      ? [`${province}-${province}`]
      : cities.map(({city}) => `${province}-${city}`)
    return [...prev, ...formatCities]
  }, [])
}

export const flatternMajor = () => {}
