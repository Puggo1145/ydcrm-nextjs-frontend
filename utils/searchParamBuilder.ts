function searchParamBuilder(params: Record<string, string>): string {
    const paramsStringArray =  Object.keys(params).map(paramName => {
        return `${paramName}=${params[paramName]}`
    })

    const concatedParamsString = paramsStringArray.join('&')

    return '?' + concatedParamsString;
}

export default searchParamBuilder;