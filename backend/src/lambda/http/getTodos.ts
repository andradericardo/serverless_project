import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getTodos } from '../../businessLogic/todos'



const logger = createLogger('getTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    logger.info('Running getTodos.', { event })

    const userId = getUserId(event)
    const items = await getTodos(userId)

    // message
    const statusCode = 200
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = JSON.stringify({items})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
