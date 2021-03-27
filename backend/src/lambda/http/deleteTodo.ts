import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'


const logger = createLogger('deleteTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Remove a TODO item by id
    logger.info('Running deleteTodo.', { event })

    const userId = getUserId(event)
    await deleteTodo(userId, todoId)

    // message
    const statusCode = 204
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = ''

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
