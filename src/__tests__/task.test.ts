import test from 'ava';

import { CORRECT } from '../correctResult';
import { Category, getCategories } from '../mockedApi';
import {
  CategoryListElement,
  categoryTree,
  getCategoryOrderKey,
} from '../task';

test('getCategoryOrderKey should return correct order key', (t) => {
  const category: Partial<Category> = { id: 1, name: 'Test', Title: '2' };
  const orderKey = getCategoryOrderKey(<Category>category);
  t.is(orderKey, 2);
});

test('categoryTree should return correct category list elements', async (t) => {
  const categoryListElements: CategoryListElement[] = await categoryTree({
    fetchCategories: getCategories,
  });
  t.true(Array.isArray(categoryListElements));
  t.true(categoryListElements.length > 0);
  categoryListElements.forEach((element) => {
    t.truthy(element.id);
    t.truthy(element.name);
    t.truthy(element.image);
    t.truthy(element.order);
    t.true(Array.isArray(element.children));
  });
});

test('categoryTree should return category list elements with proper ids', async (t) => {
  const result = await categoryTree({ fetchCategories: getCategories });

  const flatChildrenIds = result[0].children
    .flatMap((categoryListElement) => categoryListElement.children)
    .map((categoryListElement) => categoryListElement.id);
  const flatExpectedChildrenIds = CORRECT[0].children
    .flatMap((categoryListElement) => categoryListElement.children)
    .map((categoryListElement) => categoryListElement.id);
  t.deepEqual(flatChildrenIds, flatExpectedChildrenIds);
});

test('categoryTree should return category list elements with proper order', async (t) => {
  const result = await categoryTree({ fetchCategories: getCategories });

  const flatChildrenOrders = result[0].children
    .flatMap((categoryListElement) => categoryListElement.children)
    .map((categoryListElement) => categoryListElement.order);
  const flatExpectedChildrenOrders = CORRECT[0].children
    .flatMap((categoryListElement) => categoryListElement.children)
    .map((categoryListElement) => categoryListElement.order);
  t.deepEqual(flatChildrenOrders, flatExpectedChildrenOrders);
});
