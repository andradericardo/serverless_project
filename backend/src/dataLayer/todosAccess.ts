import 'source-map-support/register'

// AWS modules
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// Logger
import { createLogger } from '../utils/logger'

// Database Models
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'



const XAWS = AWSXRay.captureAWS(AWS)// ORM query object

const logger = createLogger('todosAccess') // Logger object



// DynamoDB ORM object
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX
    ) {}

  
    async todoExists(todoId: string): Promise<boolean> {
        logger.info(`Check if todo ${todoId} exists.`)
        const item = await this.getTodo(todoId)
        return !!item
    }


    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info(`Get all todos for user ${userId} in ${this.todosTable}.`)

        const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todosByUserIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {':userId': userId}
        }).promise()

        const items = result.Items
        logger.info(`Found ${items.length} todo items in ${this.todosTable} for user ${userId}.`)
        return items as TodoItem[]
    }


    async getTodo(todoId: string): Promise<TodoItem> {
        logger.info(`Get todo item ${todoId} from ${this.todosTable}.`)

        const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {todoId}
        }).promise()

        const item = result.Item
        return item as TodoItem
    }


    async createTodo(todoItem: TodoItem) {
        logger.info(`Insert todo item ${todoItem.todoId} into ${this.todosTable}.`)

        await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem,
        }).promise()
    }


    async updateTodo(todoId: string, todoUpdate: TodoUpdate) {
        logger.info(`Update todo item ${todoId} in ${this.todosTable}.`)

        await this.docClient.update({
        TableName: this.todosTable,
        Key: {todoId},
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {"#name": "name"},
        ExpressionAttributeValues: {
            ":name": todoUpdate.name,
            ":dueDate": todoUpdate.dueDate,
            ":done": todoUpdate.done
        }
        }).promise()   
    }


    async deleteTodo(todoId: string) {
        logger.info(`Delete todo item ${todoId} from ${this.todosTable}.`)

        await this.docClient.delete({
        TableName: this.todosTable,
        Key: {todoId}
        }).promise()    
    }


    async updateUrl(todoId: string, attachmentUrl: string) {
        logger.info(`Update URL of todo item ${todoId} in ${this.todosTable}.`)

        await this.docClient.update({
        TableName: this.todosTable,
        Key: {todoId},
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {':attachmentUrl': attachmentUrl}
        }).promise()
    }

}