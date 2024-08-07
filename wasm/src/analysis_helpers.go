// analysis_helpers.go

package main

import (
	common "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
)

// Get the "best" weapon in their inventory.
// If they have a primary, its the primary.
// If no primary, itll be their 2ndary - then knife.
func getPrimaryWeapon(weapons []*common.Equipment) common.Equipment {
	if len(weapons) == 0 {
		// debugMsg := fmt.Sprintf("1 Debug WEAPON LEN ZERO ")
		// js.Global().Call("postMessage", debugMsg)

		return common.Equipment{}
	}
	var primaryWeapon common.Equipment
	if len(weapons) == 1 {
		if weapons[0].Type == common.EqKnife { // Specific check for knife
			primaryWeapon = *weapons[0]
			return primaryWeapon
		}
	}
	for _, weapon := range weapons {
		weaponClass := (weapon.Type + 99) / 100
		if weaponClass >= 2 && weaponClass <= 4 {
			primaryWeapon = *weapon
			return primaryWeapon
		}
		if weaponClass == 1 {
			primaryWeapon = *weapon
		}
	}
	return primaryWeapon
}

// Calculate wether killer has more than a pistol, and if the killer has a rifle
func getKillerWeaponInfo(killerPrimaryWeapon common.Equipment) (hasMoreThanPistol, hasRifle bool) {
	weaponClass := (killerPrimaryWeapon.Type + 99) / 100
	if weaponClass >= 2 && weaponClass <= 4 {
		hasMoreThanPistol = true
	}
	if weaponClass == 4 {
		if killerPrimaryWeapon.Type != 306 { // Exclude scout
			hasRifle = true
		}
	}
	if killerPrimaryWeapon.Type == 106 { // Include P90
		hasRifle = true
	}
	return
}

// Calculate if the victim has more than a pistol, and if they had a "bad gun (non rifle)"
func getVictimWeaponInfo(killerPrimaryWeapon common.Equipment) (hasMoreThanPistol, hasBadGun bool) {
	weaponClass := (killerPrimaryWeapon.Type + 99) / 100
	if weaponClass >= 2 && weaponClass <= 4 { // SMG, Heavy, Rifle
		hasMoreThanPistol = true
	}
	if weaponClass == 2 || weaponClass == 3 { // SMG, Heavy
		hasBadGun = true
	}
	if killerPrimaryWeapon.Type == 306 { // Include scout
		hasBadGun = true
	}
	if killerPrimaryWeapon.Type == 106 { // Exclude P90
		hasBadGun = false
	}
	return
}
