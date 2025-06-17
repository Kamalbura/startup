// SkillLance Base Repository
// Purpose: Base class for all repositories with common database operations

import { DatabaseError } from '../errors/index.js'

/**
 * Base Repository class
 * All repositories should extend this class for consistent database operations
 */
export class BaseRepository {
  constructor(model) {
    this.model = model
  }

  /**
   * Create a new document
   */
  async create(data) {
    try {
      const document = new this.model(data)
      return await document.save()
    } catch (error) {
      throw new DatabaseError(`Failed to create ${this.model.modelName}: ${error.message}`, 'create')
    }
  }

  /**
   * Find a document by ID
   */
  async findById(id, options = {}) {
    try {
      const query = this.model.findById(id)
      
      if (options.populate) {
        query.populate(options.populate)
      }
      
      if (options.projection) {
        query.select(options.projection)
      }
      
      return await query.exec()
    } catch (error) {
      throw new DatabaseError(`Failed to find ${this.model.modelName} by ID: ${error.message}`, 'findById')
    }
  }

  /**
   * Find documents with filters
   */
  async find(filter = {}, options = {}) {
    try {
      const query = this.model.find(filter)
      
      if (options.sort) {
        query.sort(options.sort)
      }
      
      if (options.skip) {
        query.skip(options.skip)
      }
      
      if (options.limit) {
        query.limit(options.limit)
      }
      
      if (options.populate) {
        query.populate(options.populate)
      }
      
      if (options.projection) {
        query.select(options.projection)
      }
      
      return await query.exec()
    } catch (error) {
      throw new DatabaseError(`Failed to find ${this.model.modelName}: ${error.message}`, 'find')
    }
  }

  /**
   * Find one document
   */
  async findOne(filter = {}, options = {}) {
    try {
      const query = this.model.findOne(filter)
      
      if (options.populate) {
        query.populate(options.populate)
      }
      
      if (options.projection) {
        query.select(options.projection)
      }
      
      return await query.exec()
    } catch (error) {
      throw new DatabaseError(`Failed to find one ${this.model.modelName}: ${error.message}`, 'findOne')
    }
  }

  /**
   * Update a document by ID
   */
  async update(id, data, options = {}) {
    try {
      const updateOptions = {
        new: true,
        runValidators: true,
        ...options
      }
      
      const query = this.model.findByIdAndUpdate(id, data, updateOptions)
      
      if (options.populate) {
        query.populate(options.populate)
      }
      
      return await query.exec()
    } catch (error) {
      throw new DatabaseError(`Failed to update ${this.model.modelName}: ${error.message}`, 'update')
    }
  }

  /**
   * Update multiple documents
   */
  async updateMany(filter, data, options = {}) {
    try {
      return await this.model.updateMany(filter, data, options)
    } catch (error) {
      throw new DatabaseError(`Failed to update many ${this.model.modelName}: ${error.message}`, 'updateMany')
    }
  }

  /**
   * Delete a document by ID
   */
  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id)
    } catch (error) {
      throw new DatabaseError(`Failed to delete ${this.model.modelName}: ${error.message}`, 'delete')
    }
  }

  /**
   * Delete multiple documents
   */
  async deleteMany(filter) {
    try {
      return await this.model.deleteMany(filter)
    } catch (error) {
      throw new DatabaseError(`Failed to delete many ${this.model.modelName}: ${error.message}`, 'deleteMany')
    }
  }

  /**
   * Count documents
   */
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter)
    } catch (error) {
      throw new DatabaseError(`Failed to count ${this.model.modelName}: ${error.message}`, 'count')
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter) {
    try {
      return await this.model.exists(filter)
    } catch (error) {
      throw new DatabaseError(`Failed to check existence of ${this.model.modelName}: ${error.message}`, 'exists')
    }
  }

  /**
   * Aggregate data
   */
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline)
    } catch (error) {
      throw new DatabaseError(`Failed to aggregate ${this.model.modelName}: ${error.message}`, 'aggregate')
    }
  }

  /**
   * Bulk write operations
   */
  async bulkWrite(operations, options = {}) {
    try {
      return await this.model.bulkWrite(operations, options)
    } catch (error) {
      throw new DatabaseError(`Failed bulk write for ${this.model.modelName}: ${error.message}`, 'bulkWrite')
    }
  }

  /**
   * Find with pagination
   */
  async findWithPagination(filter = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        populate,
        projection
      } = options

      const skip = (page - 1) * limit
      
      const [items, total] = await Promise.all([
        this.find(filter, { skip, limit, sort, populate, projection }),
        this.count(filter)
      ])

      return {
        items,
        total,
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    } catch (error) {
      throw new DatabaseError(`Failed paginated find for ${this.model.modelName}: ${error.message}`, 'findWithPagination')
    }
  }

  /**
   * Find and populate references
   */
  async findWithPopulate(filter = {}, populateOptions = []) {
    try {
      let query = this.model.find(filter)
      
      if (Array.isArray(populateOptions)) {
        populateOptions.forEach(option => {
          query = query.populate(option)
        })
      } else {
        query = query.populate(populateOptions)
      }
      
      return await query.exec()
    } catch (error) {
      throw new DatabaseError(`Failed to find with populate for ${this.model.modelName}: ${error.message}`, 'findWithPopulate')
    }
  }

  /**
   * Create multiple documents
   */
  async createMany(dataArray, options = {}) {
    try {
      return await this.model.insertMany(dataArray, options)
    } catch (error) {
      throw new DatabaseError(`Failed to create many ${this.model.modelName}: ${error.message}`, 'createMany')
    }
  }

  /**
   * Upsert (update or insert)
   */
  async upsert(filter, data, options = {}) {
    try {
      const updateOptions = {
        upsert: true,
        new: true,
        runValidators: true,
        ...options
      }
      
      return await this.model.findOneAndUpdate(filter, data, updateOptions)
    } catch (error) {
      throw new DatabaseError(`Failed to upsert ${this.model.modelName}: ${error.message}`, 'upsert')
    }
  }

  /**
   * Get repository statistics
   */
  async getStats() {
    try {
      const [total, recentCount] = await Promise.all([
        this.count(),
        this.count({ 
          createdAt: { 
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        })
      ])

      return {
        total,
        recentCount,
        modelName: this.model.modelName,
        collectionName: this.model.collection.name
      }
    } catch (error) {
      throw new DatabaseError(`Failed to get stats for ${this.model.modelName}: ${error.message}`, 'getStats')
    }
  }

  /**
   * Get distinct values for a field
   */
  async distinct(field, filter = {}) {
    try {
      return await this.model.distinct(field, filter)
    } catch (error) {
      throw new DatabaseError(`Failed to get distinct values for ${this.model.modelName}: ${error.message}`, 'distinct')
    }
  }

  /**
   * Transaction helper
   */
  async transaction(callback) {
    const session = await this.model.db.startSession()
    
    try {
      await session.withTransaction(async () => {
        return await callback(session)
      })
    } catch (error) {
      throw new DatabaseError(`Transaction failed for ${this.model.modelName}: ${error.message}`, 'transaction')
    } finally {
      await session.endSession()
    }
  }

  /**
   * Create indexes
   */
  async createIndexes(indexes) {
    try {
      return await this.model.createIndexes(indexes)
    } catch (error) {
      throw new DatabaseError(`Failed to create indexes for ${this.model.modelName}: ${error.message}`, 'createIndexes')
    }
  }

  /**
   * Drop indexes
   */
  async dropIndexes(indexes) {
    try {
      if (Array.isArray(indexes)) {
        return await Promise.all(indexes.map(index => this.model.collection.dropIndex(index)))
      } else {
        return await this.model.collection.dropIndex(indexes)
      }
    } catch (error) {
      throw new DatabaseError(`Failed to drop indexes for ${this.model.modelName}: ${error.message}`, 'dropIndexes')
    }
  }
}
