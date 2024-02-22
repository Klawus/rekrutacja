import { Category } from './mockedApi';

export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

export interface CategoryTreeDependencies {
  fetchCategories: () => Promise<Record<'data', Category[]>>;
}

export const getCategoryOrderKey = (category: Category): number => {
  const parsedTitle = parseInt(category.Title);
  return Number.isInteger(parsedTitle) ? parsedTitle : category.id;
};

const applyShowOnHomeCriteria = (
  categories: CategoryListElement[]
): CategoryListElement[] => {
  const showOnHomeThreshold =
    categories.length <= 5
      ? 3
      : categories.filter((category) => category.showOnHome).length;

  return categories.map((category, index) => ({
    ...category,
    showOnHome: index < showOnHomeThreshold || category.showOnHome,
  }));
};

const convertCategoryToCategoryListElement = (
  category: Category
): CategoryListElement => {
  const { id, name, MetaTagDescription, children } = category;
  return {
    id,
    name,
    image: MetaTagDescription,
    order: getCategoryOrderKey(category),
    children: transformCategoriesToCategoryListElements(children),
    showOnHome: false,
  };
};

const transformCategoriesToCategoryListElements = (
  categories: Category[]
): CategoryListElement[] => {
  return categories
    .map(convertCategoryToCategoryListElement)
    .sort((a, b) => a.order - b.order);
};

export const categoryTree = async ({
  fetchCategories,
}: CategoryTreeDependencies): Promise<CategoryListElement[]> => {
  const { data } = await fetchCategories();

  if (!data) {
    return [];
  }

  const initialCategoryListElements =
    transformCategoriesToCategoryListElements(data);

  return applyShowOnHomeCriteria(initialCategoryListElements);
};
