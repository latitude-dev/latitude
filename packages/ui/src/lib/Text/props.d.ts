import type { TextColor } from '$lib/tokens/colors.ts';
import type { FontSize, FontSpacing, FontWeight } from '$lib/tokens/font.ts';
import type { WhiteSpace } from '$lib/tokens/whiteSpace.ts';
import type { WordBreak } from '$lib/tokens/wordBreak.ts';

export type Props = {
	capitalize: boolean;
	centered: boolean;
	color: TextColor;
	ellipsis: boolean;
	lineThrough: boolean;
	noWrap: boolean;
	size: FontSize;
	underline: boolean;
	uppercase: boolean;
	userSelect: boolean;
	spacing: FontSpacing;
	weight: FontWeight;
	whiteSpace: WhiteSpace;
	wordBreak: WordBreak;
};
