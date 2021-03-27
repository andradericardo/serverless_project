import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'


const logger = createLogger('generateUploadUrl')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('Running generateUploadUrl.', { event })

    const userId = getUserId(event)
    const attachmentId = uuid.v4()

    const uploadUrl = await generateUploadUrl(attachmentId)
    await updateAttachmentUrl(userId, todoId, attachmentId)

    // message
    const statusCode = 200
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = JSON.stringify({uploadUrl})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
