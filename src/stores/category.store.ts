import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useAuth } from '@/stores/auth.store'
import type { ICategory } from '@/common/interfaces'
import { CategoryService } from '@/services/category.service'
import { ApiResponseHandlerUtils } from '@/utils'
import type { CreateCategoryDto } from 'src/common/schemas'
import { CategoryType } from '@/common/constants'

export const useCategory = defineStore('category', () => {
  const auth = useAuth()
  const categoryService = new CategoryService(auth.accessToken)
  const categories = ref<ICategory[]>()

  const expenseCategories = computed(() => {
    const results: ICategory[] = []
    categories.value
      ?.filter((category) => category.type === CategoryType.EXPENSE)
      .forEach((category) => {
        results.push(category)
        category.children?.forEach((child) => results.push(child))
      })

    return results
  })
  const incomeCategories = computed(() => {
    const results: ICategory[] = []
    categories.value
      ?.filter((category) => category.type === CategoryType.INCOME)
      .forEach((category) => {
        results.push(category)
        category.children?.forEach((child) => results.push(child))
      })

    return results
  })

  const setCategories = (data: ICategory[]) => (categories.value = data)

  const loadCategories = async () => {
    try {
      const { data } = await categoryService.findAll()
      setCategories(data)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to load categories. Please try again later.'
      )
    }

    return ApiResponseHandlerUtils.successHandler('Categories loaded successfully.')
  }

  const loadCategory = async (id: number) => {
    try {
      const { data, message } = await categoryService.findOne(id)
      return ApiResponseHandlerUtils.successHandler(message, data)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to load category. Please try again later.'
      )
    }
  }

  const createCategory = async (createCategoryDto: CreateCategoryDto) => {
    try {
      const { data, message } = await categoryService.create(createCategoryDto)
      addCategory(data)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to create category. Please try again later.'
      )
    }
  }

  const updateCategory = async (id: number, updateCategoryDto: CreateCategoryDto) => {
    try {
      const { message } = await categoryService.update(id, updateCategoryDto)
      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to update category. Please try again later.'
      )
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      const { message } = await categoryService.delete(id)
      categories.value = categories.value?.filter((category) => category.id !== id)

      return ApiResponseHandlerUtils.successHandler(message)
    } catch (e) {
      return ApiResponseHandlerUtils.errorHandler(
        e,
        'Failed to delete category. Please try again later.'
      )
    }
  }

  const addCategory = (category: ICategory) => {
    const hasParent = !!category.parent
    if (!hasParent) {
      categories.value?.push(category)
      return
    }

    const parent = categories.value?.find((c) => c.id === category.parent?.id)
    if (parent) {
      parent.children?.push(category)
    }
  }

  return {
    categories,
    expenseCategories,
    incomeCategories,
    loadCategories,
    loadCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
