const { RequestParametersMissing } = require("../../../../../packages/errors/externalErrors");
const { handler } = require("../../../../../packages/search/lambda/get");
const { get } = require("../../../../../packages/search/libs/get");

jest.mock("../../../../../packages/search/libs/get");

describe('lambda function test: ', () => {
    let error;
    let response;
    beforeEach(() => {
        error = undefined;
        response = undefined;
    })

    describe('queryString parameters', () => {
        test('when the input is missing queryString Parameter', async () => {
            try {
                response = await handler({
                    headers: {},
                    pathParameters: {},
                });
            } catch (e) {
                error = e;
            }
            expect(error).toBeUndefined();
            expect(get).toBeCalledTimes(0);
            expect(response).toEqual({
                statusCode: '400',
                body: {
                    code: 'SS4000',
                    description: 'RequestParametersMissing',
                    details: 'The search query is missing the search term',
                }
            })
        });
        test('when the input queryString Parameter is invalid', async () => {
            try {
                response = await handler({
                    headers: {},
                    pathParameters: {},
                    queryStringParameters: {q : ''},
                });
            } catch (e) {
                error = e;
            }
            expect(error).toBeUndefined();
            expect(get).toBeCalledTimes(0);
            expect(response).toEqual({
                statusCode: '400',
                body: {
                    code: 'SS4001',
                    description: 'RequestParametersInvalid',
                    details: 'The search term provided is invalid',
                }
            })
        });
        test('when the input queryString Parameter is valid ', async () => {
            try {
                response = await handler({
                    headers: {},
                    pathParameters: {},
                    queryStringParameters: {q : 'applepie'},
                });
            } catch (e) {
                error = e;
            }
            expect(error).toBeUndefined();
            expect(get).toBeCalledTimes(1);
            expect(get).toBeCalledWith({
                queryString: 'applepie',
            });
            expect(response).toMatchObject({
                statusCode: '200',
            })
        });
    })
})