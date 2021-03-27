import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('updateTodos')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    logger.info('Running updateTodos.', { event })

    const userId = getUserId(event)
    await updateTodo(userId, todoId, updatedTodo)

    // message
    const statusCode = 200
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
