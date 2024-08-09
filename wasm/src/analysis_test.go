// analysis_test.go

package main

import (
	"testing"

	common "github.com/markus-wa/demoinfocs-golang/v4/pkg/demoinfocs/common"
)

// TestGetPrimaryWeapon tests the getPrimaryWeapon function with various scenarios
func TestGetPrimaryWeapon(t *testing.T) {
	tests := []struct {
		name     string
		weapons  []*common.Equipment
		expected common.Equipment
	}{
		{"Empty inventory", []*common.Equipment{}, common.Equipment{}},
		{"Only knife", []*common.Equipment{{Type: common.EqKnife}}, common.Equipment{Type: common.EqKnife}},
		{"Pistol and rifle", []*common.Equipment{{Type: common.EqP250}, {Type: common.EqAK47}}, common.Equipment{Type: common.EqAK47}},
		{"Pistol and SMG", []*common.Equipment{{Type: common.EqP250}, {Type: common.EqMP9}}, common.Equipment{Type: common.EqMP9}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := getPrimaryWeapon(tt.weapons)
			if result.Type != tt.expected.Type {
				t.Errorf("getPrimaryWeapon() = %v, want %v", result.Type, tt.expected.Type)
			}
		})
	}
}

// TestGetKillerWeaponInfo tests the getKillerWeaponInfo function with various scenarios
func TestGetKillerWeaponInfo(t *testing.T) {
	tests := []struct {
		name                   string
		weapon                 common.Equipment
		expectedMoreThanPistol bool
		expectedHasRifle       bool
	}{
		{"Knife", common.Equipment{Type: common.EqKnife}, false, false},
		{"Pistol", common.Equipment{Type: common.EqP250}, false, false},
		{"Rifle", common.Equipment{Type: common.EqAK47}, true, true},
		{"SMG", common.Equipment{Type: common.EqMP9}, true, false},
		{"Scout", common.Equipment{Type: common.EqSSG08}, true, false},
		{"P90", common.Equipment{Type: common.EqP90}, true, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			moreThanPistol, hasRifle := getKillerWeaponInfo(tt.weapon)
			if moreThanPistol != tt.expectedMoreThanPistol {
				t.Errorf("getKillerWeaponInfo() moreThanPistol = %v, want %v", moreThanPistol, tt.expectedMoreThanPistol)
			}
			if hasRifle != tt.expectedHasRifle {
				t.Errorf("getKillerWeaponInfo() hasRifle = %v, want %v", hasRifle, tt.expectedHasRifle)
			}
		})
	}
}
