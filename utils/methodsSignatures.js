/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Monday May 10th 2021
**	@Filename:				methodsSignatures.js
******************************************************************************/

const	SIGNATURES = {
	STANDARD_APPROVE: '0x095ea7b3',
	YV_SET_DEPOSIT_LIMIT: '0xbdc8144b',
	YV_ADD_STRATEGY: '0x14b4e26e',
	YV_SET_GOVERNANCE: '0xab033ea9',
	YV_SET_MANAGEMENT_FEES: '0xfe56e232',
	YV_MIGRATE_STRATEGY: '0x6cb56d19',
	YV_UPDATE_STRATEGY_MAX_DEPT_PER_HARVEST: '0x4757a156',
	YV_UPDATE_STRATEGY_DEPT_RATIO: '0x7c6a4f24',
	YV_SET_MANAGEMENT: '0xd4a22bde',

	YV_DEPOSIT: '0xd0e30db0',
	YV_DEPOSIT_VOWID: '0xb6b55f25',
	YV_WITHDRAW: '0x3ccfd60b',
	YV_WITHDRAW_AMOUNT: '0x2e1a7d4d',
	YV_TRANSFER: '0xa9059cbb',
	ZAP_IN: '0x82650b10',

	DEPOSITS: ['0xd0e30db0', '0xb6b55f25', '0x6e553f65'],
	WITHDRAWS: ['0x3ccfd60b', '0x2e1a7d4d', '0xf714ce', '0xe63697c8'],
	TRANSFERS: ['0xa9059cbb'],
	APPROVES: ['0x095ea7b3'],
	ZAP_INS: ['0x82650b10', '0x38b32e68'],
	ZAP_OUTS: ['0xf6216495']
}
const	SIGNATURES_EXPLAIN = {
	'0x095ea7b3': 'Approve',
	'0xbdc8144b': 'Set deposit limit',
	'0x14b4e26e': 'Add strategy',
	'0xab033ea9': 'Set governance',
	'0xfe56e232': 'Set management fees',
	'0x6cb56d19': 'Migrate strategy',
	'0x4757a156': 'Update strategy max dept per harvest',
	'0x7c6a4f24': 'Update strategy dept ratio',
	'0xd4a22bde': 'Set management',

	'0xd0e30db0': 'Deposit',
	'0xb6b55f25': 'Deposit',
	'0x3ccfd60b': 'Withdraw',
	'0x2e1a7d4d': 'Withdraw',
	'0xa9059cbb': 'Transfer',
	'0x82650b10': 'Zap in',
}
const	SIGNATURES_TYPES = {
	APPROVE: ['0x095ea7b3'],
	MANAGEMENT: ['0xbdc8144b', '0x14b4e26e', '0xab033ea9', '0xfe56e232', '0x6cb56d19', '0x4757a156', '0x7c6a4f24', '0xd4a22bde'],
	DEPOSIT: ['0xd0e30db0', '0xb6b55f25', '0x82650b10'],
	WITHDRAW: ['0x3ccfd60b', '0x2e1a7d4d'],
	TRANSFER: ['0xa9059cbb'],
}

export function getSignatureTitle(hex) {
	return SIGNATURES_EXPLAIN[hex] || hex;
}
export function findSignatureTitle(hex) {
	return Object.entries(SIGNATURES_TYPES).find(([, values]) => values.indexOf(hex) > -1)?.[0] || 'MANAGEMENT';
}

export default SIGNATURES;