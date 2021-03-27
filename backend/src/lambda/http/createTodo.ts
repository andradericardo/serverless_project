import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('createTodo')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item
    logger.info('Running createTodo.', { event })

    const userId = getUserId(event)
    const newItem = await createTodo(userId, newTodo)
    
    // message
    const statusCode = 201
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
    const body = JSON.stringify({item: newItem})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
