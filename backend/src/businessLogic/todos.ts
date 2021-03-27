import 'source-map-support/register'

import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess'
import { TodosStorage } from '../dataLayer/todosStorage'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')

const todosAccess = new TodosAccess()
const todosStorage = new TodosStorage()


export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Get all todos for user ${userId}.`, { userId })
    return await todosAccess.getTodos(userId)
}


export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()
    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...createTodoRequest
    }
    logger.info(`Create new todo item with id ${todoId} for user ${userId}.`, { userId, todoId, todoItem: newItem })
    await todosAccess.createTodo(newItem)
    return newItem
}


export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Update todo with id ${todoId} for user ${userId}.`, { userId, todoId, todoUpdate: updateTodoRequest })
    const item = await todosAccess.getTodo(todoId)

    if (!item)
        throw new Error(`Item with id ${todoId} not found.`)

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo with id ${todoId}.`)
        throw new Error('User not authorized.')
    }
    todosAccess.updateTodo(todoId, updateTodoRequest as TodoUpdate)
}


export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`Delete todo with id ${todoId} for user ${userId}.`, { userId, todoId })
    const item = await todosAccess.getTodo(todoId)
    if (!item)
        throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
        throw new Error('User not authorized.')
    }
    todosAccess.deleteTodo(todoId)
}


export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`Get URL for attachment with id ${attachmentId}.`)
    const attachmentUrl = await todosStorage.getAttachmentUrl(attachmentId)
    logger.info(`Update todo with id ${todoId} with attachment URL with id ${attachmentUrl}.`, { userId, todoId })
    const item = await todosAccess.getTodo(todoId)

    if (!item)
        throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}.`)
        throw new Error('User not authorized.')
    }
    await todosAccess.updateUrl(todoId, attachmentUrl)
}


export async function generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Generate upload URL for attachment with id ${attachmentId}.`)
    const uploadUrl = await todosStorage.getSignedUrl(attachmentId)
    return uploadUrl
}