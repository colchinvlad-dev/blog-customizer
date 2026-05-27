import { useState, useRef, FormEvent } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  ArticleStateType,
} from '../../constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  currentSettings: ArticleStateType;
  onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ currentSettings, onApply }: ArticleParamsFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<ArticleStateType>(currentSettings);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useOutsideClickClose({
    isOpen,
    rootRef: sidebarRef,
    onChange: setIsOpen,
    onClose: () => setIsOpen(false),
  });

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onApply(formState);
  };

  const handleReset = () => {
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={handleToggle} />
      <aside
        ref={sidebarRef}
        className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Text as="h2" size={31} weight={800} uppercase>
            Настройки
          </Text>
          <Separator />

          <Select
            title="Шрифт"
            options={fontFamilyOptions}
            selected={formState.fontFamilyOption}
            onChange={(option) =>
              setFormState((prev) => ({ ...prev, fontFamilyOption: option }))
            }
          />

          <RadioGroup
            name="fontSize"
            title="Размер шрифта"
            options={fontSizeOptions}
            selected={formState.fontSizeOption}
            onChange={(option) =>
              setFormState((prev) => ({ ...prev, fontSizeOption: option }))
            }
          />

          <Select
            title="Цвет текста"
            options={fontColors}
            selected={formState.fontColor}
            onChange={(option) => setFormState((prev) => ({ ...prev, fontColor: option }))}
          />

          <Select
            title="Цвет фона"
            options={backgroundColors}
            selected={formState.backgroundColor}
            onChange={(option) =>
              setFormState((prev) => ({ ...prev, backgroundColor: option }))
            }
          />

          <RadioGroup
            name="contentWidth"
            title="Ширина контента"
            options={contentWidthArr}
            selected={formState.contentWidth}
            onChange={(option) => setFormState((prev) => ({ ...prev, contentWidth: option }))}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" onClick={handleReset} />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
