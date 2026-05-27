import { useState, useRef, FormEvent, useCallback, useEffect } from 'react';
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
	OptionType,
} from '../../constants/articleProps';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentSettings: ArticleStateType;
	onApply: (settings: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentSettings,
	onApply,
}: ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentSettings);

	const sidebarRef = useRef<HTMLDivElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	// Объединяем рефы для корректной обработки outside-click (исключаем стрелку)
	const handleOutsideClick = (event: MouseEvent) => {
		const isClickOnArrow = arrowButtonRef.current?.contains(
			event.target as Node
		);
		if (isClickOnArrow) return;

		const isClickInsideSidebar = sidebarRef.current?.contains(
			event.target as Node
		);
		if (!isClickInsideSidebar && isFormOpen) {
			setIsFormOpen(false);
		}
	};

	useOutsideClickClose({
		isOpen: isFormOpen,
		rootRef: sidebarRef,
		onChange: setIsFormOpen,
		onClose: () => setIsFormOpen(false),
	});

	// Исправлено: useEffect вместо useState
	useEffect(() => {
		if (isFormOpen) {
			window.addEventListener('mousedown', handleOutsideClick);
			return () => window.removeEventListener('mousedown', handleOutsideClick);
		}
	}, [isFormOpen]);

	const handleToggle = () => setIsFormOpen((prev) => !prev);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	// Универсальный обработчик для Select
	const createSelectChangeHandler = useCallback(
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setFormState((prev) => ({ ...prev, [field]: option }));
		},
		[]
	);

	// Универсальный обработчик для RadioGroup
	const createRadioChangeHandler = useCallback(
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setFormState((prev) => ({ ...prev, [field]: option }));
		},
		[]
	);

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isFormOpen} onClick={handleToggle} />
			</div>
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Настройки
					</Text>
					<Separator />

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={createSelectChangeHandler('fontFamilyOption')}
					/>

					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={createRadioChangeHandler('fontSizeOption')}
					/>

					<Select
						title='Цвет текста'
						options={fontColors}
						selected={formState.fontColor}
						onChange={createSelectChangeHandler('fontColor')}
					/>

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={createSelectChangeHandler('backgroundColor')}
					/>

					<RadioGroup
						name='contentWidth'
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={createRadioChangeHandler('contentWidth')}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
