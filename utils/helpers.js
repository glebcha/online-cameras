export function hash() {
    return Math.random().toString(16).slice(2, 10)
}

export function isJSON(json) {
  try {
    const obj = JSON.parse(json)
    if (obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {}
  return false
}

export function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]'
}

export function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]'
}

export function trimString(str, length) {
    if(isString(str)) {
        return `${ str.substr(0, length) }${ str.length > length ? '...' : '' }`
    }

    return ''
}

export function xhr(options) {
    const {
      url,
      method='GET',
      body=null,
      headers=[],
      responseType,
      optional={}
    } = options

    return new Promise(
        (resolve, reject) => {
            const request = new XMLHttpRequest()

            request.open(method, url)

            if(headers.length > 0) {
              headers.forEach(header =>
                request.setRequestHeader(header.name, header.value)
              )
            }

            if(responseType) {
                request.responseType = responseType
            }

            request.onreadystatechange = function() {
                if(this.readyState === 4) {
                    if(this.status === 200) {
                        resolve({
                            result: this.response,
                            optional,
                        })
                    } else {
                        const { status, statusText } = this

                        reject({status, statusText})
                    }
                }
            }

            request.send(body)
        }
    )
}
