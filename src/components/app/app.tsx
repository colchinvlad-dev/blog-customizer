import { CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from '../article/Article';
import { ArticleParamsForm } from '../article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from '../../constants/articleProps';

import styles from './app.module.scss';

export const App = () => {
  const [currentSettings, setCurrentSettings] = useState<ArticleStateType>(defaultArticleState);

  const handleApply = (newSettings: ArticleStateType) => {
    setCurrentSettings(newSettings);
  };

  return (
    <main
      className={clsx(styles.main)}
      style={
        {
          '--font-family': currentSettings.fontFamilyOption.value,
          '--font-size': currentSettings.fontSizeOption.value,
          '--font-color': currentSettings.fontColor.value,
          '--container-width': currentSettings.contentWidth.value,
          '--bg-color': currentSettings.backgroundColor.value,
        } as CSSProperties
      }>
      <ArticleParamsForm currentSettings={currentSettings} onApply={handleApply} />
      <Article />
    </main>
  );
};