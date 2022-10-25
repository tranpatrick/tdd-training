import axios from 'axios';
import * as apiCalls from '../api/apiCalls'

describe('apiCalls', () => {

    describe('signup', () => {

        it('calls /api/1.0/users', () => {
            const mockSignup = jest.fn();
            axios.post = mockSignup;
            apiCalls.signup({});

            const path = mockSignup.mock.calls[0][0]
            expect(path).toBe('/api/v1.0/users')
        })

    })

})