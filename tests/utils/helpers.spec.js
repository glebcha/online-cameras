import { trimString } from '../../utils/helpers'

describe('Utils', () => {

    it('should trim string correctly', () => {
        const trimmedString = trimString('very long', 2)

        expect(trimmedString).toEqual('ve...')
    })

})
